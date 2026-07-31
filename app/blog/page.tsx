import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { blogPosts } from '../../content/site-content'

export const metadata: Metadata = {
  title: 'Blog bảo mật tài khoản',
  description: 'Bài viết thực hành về phishing, recovery code, backup 2FA và thói quen bảo mật.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  return (
    <main className="article-page">
      <Breadcrumb className="article-breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink render={<Link href="/" />}>Công cụ</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Blog</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="article-hero">
        <div>
          <Badge variant="secondary">Thư viện bảo mật</Badge>
          <h1>Hiểu rủi ro, xây thói quen tốt</h1>
          <p>Các bài ngắn tập trung vào hành động thực tế để bảo vệ tài khoản, phương thức 2FA và đường khôi phục.</p>
        </div>
        <div className="article-index"><strong>Chủ đề</strong><span>Phishing · 2FA · Recovery · Backup</span></div>
      </header>
      <div className="article-body">
        <section className="blog-grid">
          {Object.entries(blogPosts).map(([slug, post]) => (
            <Link className="blog-item" href={`/blog/${slug}`} key={slug}>
              <div className="blog-item-meta"><Badge variant="outline">{post.kicker}</Badge><span>{new Intl.DateTimeFormat('vi-VN').format(new Date(post.date))}</span></div>
              <h2>{post.title}</h2>
              <p>{post.description}</p>
              <Separator />
              <span className="blog-item-link">Đọc bài viết <ArrowRight data-icon="inline-end" weight="bold" /></span>
            </Link>
          ))}
        </section>
      </div>
    </main>
  )
}
