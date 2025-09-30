import type { Metadata } from 'next';
import { Geist, Geist_Mono, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastProvider } from '@/components/notifications/ToastProvider';
import Providers from './providers';
import Script from 'next/script';
import type { Viewport } from 'next';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'LinkMatch',
    template: 'LinkMatch | %s',
  },
  description:
    'LinkMatch adalah platform pencocokan cerdas yang mempertemukan perekrut dengan talenta profesional secara cepat dan relevan menggunakan AI (AWS Bedrock + Semantic Search).',
  applicationName: 'LinkMatch',
  keywords: [
    'LinkMatch',
    'rekrutmen',
    'talenta',
    'pencocokan talenta',
    'semantic search',
    'AWS Bedrock',
    'AI',
    'Indonesia',
    'cari kerja',
    'lowongan',
  ],
  authors: [{ name: 'LinkMatch Team' }],
  creator: 'LinkMatch',
  publisher: 'LinkMatch',
  alternates: {
    canonical: '/',
    languages: {
      'id-ID': '/id',
      'en-US': '/en',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    siteName: 'LinkMatch',
    title: 'LinkMatch — Platform Pencocokan Talenta & Recruiter',
    description:
      'Temukan talenta atau peluang kerja lebih cepat dan relevan dengan AI (AWS Bedrock + Semantic Search).',
    url: '/',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LinkMatch — Talenta & Recruiter Matcher',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkMatch — Platform Pencocokan Talenta & Recruiter',
    description:
      'Temukan talenta atau peluang kerja lebih cepat dan relevan dengan AI (AWS Bedrock + Semantic Search).',
    creator: '@linkmatch',
    site: '@linkmatch',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  },
  referrer: 'origin-when-cross-origin',
};

export function generateViewport(): Viewport {
  return {
    themeColor: [
      { media: '(prefers-color-scheme: dark)', color: '#11171a' },
      { media: '(prefers-color-scheme: light)', color: '#11171a' },
    ],
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    viewportFit: 'cover',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LinkMatch',
    url: baseUrl,
    logo: `${baseUrl}/favicon.ico`,
    sameAs: [
      'https://www.linkedin.com/in/mcqeems/',
      'https://github.com/mcqeems',
      'https://www.instagram.com/mcqeems/',
      'https://www.qeem.site',
    ],
  };
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LinkMatch',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="dark" data-theme="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased`}>
        <Providers>
          <ToastProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </ToastProvider>
        </Providers>
        <Script
          id="ld-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Script
          id="ld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
