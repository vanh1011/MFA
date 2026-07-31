import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteChrome } from '../components/site-chrome'
import './globals.css'

const geist = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-geist-mono' })
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://2fa-kira.vercel.app'
const siteDescription = 'Công cụ lấy OTP 2FA xử lý trên thiết bị cùng thư viện kiến thức bảo mật.'
const socialImage = { url: '/kira-logo.png', width: 512, height: 512, alt: 'Logo Kira Tech' }

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'MFA Tool — Mã 2FA và kiến thức bảo mật', template: '%s | MFA Tool' },
  description: siteDescription,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'MFA Tool',
    title: 'MFA Tool — Mã 2FA và kiến thức bảo mật',
    description: siteDescription,
    images: [socialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MFA Tool — Mã 2FA và kiến thức bảo mật',
    description: siteDescription,
    images: ['/kira-logo.png'],
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MFA Tool',
    url: siteUrl,
    inLanguage: 'vi-VN',
    description: siteDescription,
    image: `${siteUrl}/kira-logo.png`,
  }

  return (
    <html lang="vi" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
        <Analytics />
      </body>
    </html>
  )
}
