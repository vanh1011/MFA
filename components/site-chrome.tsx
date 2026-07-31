'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { EnvelopeSimple, TelegramLogo, YoutubeLogo } from '@phosphor-icons/react'
import { ThemeToggle } from './theme-toggle'

const nav = [
  ['/huong-dan', 'Hướng dẫn'],
  ['/2fa-la-gi', '2FA là gì'],
  ['/bao-mat-tai-khoan', 'Bảo mật'],
  ['/faq', 'FAQ'],
  ['/blog', 'Blog'],
] as const

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isTool = pathname === '/'

  return (
    <div className={`site-shell${isTool ? ' tool-route' : ''}`}>
      {!isTool && (
        <header className="content-header">
          <div className="content-header-inner">
            <Link href="/" className="content-brand">
              <Image className="content-brand-logo" src="/kira-logo.png" alt="Kira Tech" width={32} height={32} priority />
              MFA Tool
            </Link>
            <nav className="content-nav" aria-label="Điều hướng chính">
              {nav.map(([href, label]) => <Link key={href} href={href}>{label}</Link>)}
              <Link href="/" className="content-tool-link">Mở công cụ</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>
      )}

      {children}

      {!isTool && (
        <footer className="content-footer">
          <div className="content-footer-inner">
            <div>
              <h2>MFA Tool</h2>
              <p>Công cụ tiện ích và kiến thức bảo mật tiếng Việt. Khóa TOTP được xử lý trong trình duyệt; đây không phải dịch vụ lưu trữ tài khoản.</p>
            </div>
            <div className="footer-links">
              <strong>Liên hệ</strong>
              <a href="https://t.me/kiratech1011" target="_blank" rel="noreferrer"><TelegramLogo weight="fill" />Telegram @kiratech1011</a>
              <a href="https://www.youtube.com/@KiraTechTKpremium" target="_blank" rel="noreferrer"><YoutubeLogo weight="fill" />YouTube Kira Tech</a>
              <a href="mailto:kira10111907@gmail.com"><EnvelopeSimple weight="bold" />kira10111907@gmail.com</a>
              <Link href="/gioi-thieu">Giới thiệu</Link>
              <Link href="/lien-he">Xem trang liên hệ</Link>
            </div>
            <div className="footer-links">
              <strong>Pháp lý & quyền riêng tư</strong>
              <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
              <Link href="/dieu-khoan-su-dung">Điều khoản sử dụng</Link>
              <Link href="/cookie">Cookie và lưu trữ cục bộ</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
