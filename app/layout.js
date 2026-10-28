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

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Sachin Chauhan | Frontend & Full Stack Developer',
    template: '%s | Sachin Chauhan',
  },
  description:
    'Software Engineer with 3 years of experience building web applications, frontend features, backend functionality, and third-party integrations.',
  keywords: [
    'Sachin Chauhan',
    'Frontend Developer',
    'React Developer',
    'Full Stack Developer',
    'Next.js Developer',
    'TypeScript',
    'Software Engineer',
    'JavaScript',
    'Node.js',
    'Web Architecture',
    'Portfolio',
    'India',
  ],
  authors: [{ name: 'Sachin Chauhan', url: SITE_URL }],
  creator: 'Sachin Chauhan',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: SITE_URL,
    siteName: 'Sachin Chauhan',
    title: 'Sachin Chauhan | Frontend & Full Stack Developer',
    description:
      'Software Engineer with 3 years of experience building web applications, frontend features, backend functionality, and third-party integrations.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Sachin Chauhan | Full Stack Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sachin Chauhan | Full Stack Developer',
    description:
      'Software Engineer with 3 years of experience building web applications, frontend features, backend functionality, and third-party integrations. Available worldwide for collaborations.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
