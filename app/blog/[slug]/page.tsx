import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentPage } from '../../../components/content-page'
import { blogPosts } from '../../../content/site-content'

const siteDescription = 'Công cụ lấy OTP 2FA xử lý trên thiết bị cùng thư viện kiến thức bảo mật.'

export function generateStaticParams() {
  return Object.keys(blogPosts).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  if (!post) return {}
  return {
    title: post.title,
    description: siteDescription,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: siteDescription,
      type: 'article',
      publishedTime: post.date,
      locale: 'vi_VN',
      images: [{ url: '/kira-logo.png', width: 512, height: 512, alt: 'Logo Kira Tech' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: siteDescription,
      images: ['/kira-logo.png'],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = blogPosts[slug]
  if (!post) notFound()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mfa-tool.vercel.app'
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: 'vi-VN',
    mainEntityOfPage: `${siteUrl}/blog/${slug}`,
    publisher: { '@type': 'Organization', name: 'MFA Tool' },
  }
  return (
    <>
      <ContentPage content={post} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    </>
  )
}
