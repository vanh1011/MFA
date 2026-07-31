import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentPage } from '../../../components/content-page'
import { blogPosts } from '../../../content/site-content'

export function generateStaticParams() {
  return Object.keys(blogPosts).map(slug => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts[slug]
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.description, type: 'article', publishedTime: post.date, locale: 'vi_VN' },
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
