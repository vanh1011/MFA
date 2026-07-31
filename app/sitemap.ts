import type { MetadataRoute } from 'next'
import { blogPosts } from '../content/site-content'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mfa-tool.vercel.app'
  const pages = ['', '/huong-dan', '/2fa-la-gi', '/bao-mat-tai-khoan', '/faq', '/blog', '/gioi-thieu', '/lien-he', '/chinh-sach-bao-mat', '/dieu-khoan-su-dung', '/cookie']
  return [
    ...pages.map(path => ({ url: `${base}${path}`, lastModified: new Date('2026-07-31'), changeFrequency: path === '/blog' ? 'weekly' as const : 'monthly' as const, priority: path === '' ? 1 : .7 })),
    ...Object.entries(blogPosts).map(([slug, post]) => ({ url: `${base}/blog/${slug}`, lastModified: new Date(post.date), changeFrequency: 'monthly' as const, priority: .65 })),
  ]
}

