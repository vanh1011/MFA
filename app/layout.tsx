import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SiteChrome } from '../components/site-chrome'
import './globals.css'

const geist = Geist({ subsets: ['latin', 'latin-ext'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin', 'latin-ext'], variable: '--font-geist-mono' })
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mfa-tool.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'MFA Tool — Mã 2FA và kiến thức bảo mật', template: '%s | MFA Tool' },
  description: 'Tạo mã TOTP ngay trên thiết bị và đọc hướng dẫn thực tế về 2FA, phishing, recovery code và bảo vệ tài khoản.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'MFA Tool',
    title: 'MFA Tool — Mã 2FA và kiến thức bảo mật',
    description: 'Công cụ TOTP xử lý trên thiết bị cùng thư viện kiến thức bảo mật tiếng Việt.',
  },
  twitter: { card: 'summary_large_image' },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MFA Tool',
    url: siteUrl,
    inLanguage: 'vi-VN',
    description: 'Công cụ tạo mã TOTP trên thiết bị và nội dung hướng dẫn bảo mật tài khoản.',
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
