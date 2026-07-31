import type { Metadata } from 'next'
import { Suspense } from 'react'
import App from '../src/App'

export const metadata: Metadata = {
  title: 'Công cụ lấy mã 2FA TOTP',
  description: 'Tạo mã TOTP từ khóa Base32 ngay trên thiết bị, tra cứu IP và thông tin tên miền.',
}

export default function HomePage() {
  return <Suspense fallback={<main style={{ minHeight: '100dvh', background: '#f6faf7' }} />}><App /></Suspense>
}

