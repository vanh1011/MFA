import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MFA Tool',
    short_name: 'MFA Tool',
    description: 'Tạo mã TOTP trên thiết bị và tra cứu thông tin IP, tên miền.',
    start_url: '/',
    display: 'standalone',
    background_color: '#f6faf7',
    theme_color: '#278f50',
    icons: [
      { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    ],
  }
}

