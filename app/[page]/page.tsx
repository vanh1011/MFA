import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ContentPage } from '../../components/content-page'
import { ContactChannels } from '../../components/contact-channels'
import { FaqAccordion } from '../../components/faq-accordion'
import { pages } from '../../content/site-content'

const staticPages = ['huong-dan', '2fa-la-gi', 'bao-mat-tai-khoan', 'faq', 'gioi-thieu', 'lien-he', 'chinh-sach-bao-mat', 'dieu-khoan-su-dung', 'cookie']

export function generateStaticParams() {
  return staticPages.map(page => ({ page }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params
  const content = pages[page]
  if (!content) return {}
  return {
    title: content.title,
    description: content.description,
    alternates: { canonical: `/${page}` },
    openGraph: { title: content.title, description: content.description, type: 'article', locale: 'vi_VN' },
  }
}

export default async function StaticContentPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const content = pages[page]
  if (!content || !staticPages.includes(page)) notFound()

  const faqSchema = page === 'faq' ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.sections.map(section => ({
      '@type': 'Question',
      name: section.title,
      acceptedAnswer: { '@type': 'Answer', text: section.body.join(' ') },
    })),
  } : null

  return (
    <>
      <ContentPage content={content} hideSections={page === 'faq'}>
        {page === 'faq' && <FaqAccordion sections={content.sections} />}
        {page === 'lien-he' && <ContactChannels />}
      </ContentPage>
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />}
    </>
  )
}

