import type { Metadata } from 'next'
import { Suspense } from 'react'
import App from '../src/App'

export const metadata: Metadata = {
  title: 'Công cụ lấy mã 2FA TOTP',
  description: 'Công cụ lấy OTP 2FA xử lý trên thiết bị cùng thư viện kiến thức bảo mật.',
  openGraph: {
    title: 'Công cụ lấy mã 2FA TOTP',
    description: 'Công cụ lấy OTP 2FA xử lý trên thiết bị cùng thư viện kiến thức bảo mật.',
    images: [{ url: '/kira-logo.png', width: 512, height: 512, alt: 'Logo Kira Tech' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Công cụ lấy mã 2FA TOTP',
    description: 'Công cụ lấy OTP 2FA xử lý trên thiết bị cùng thư viện kiến thức bảo mật.',
    images: ['/kira-logo.png'],
  },
}

export default function HomePage() {
  return <Suspense fallback={<main style={{ minHeight: '100dvh', background: '#f6faf7' }} />}><App /></Suspense>
}

