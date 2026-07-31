import Link from 'next/link'
import { ArrowRight, Info } from '@phosphor-icons/react/dist/ssr'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import type { PageContent } from '../content/site-content'

export function ContentPage({ content, children, hideSections = false }: { content: PageContent; children?: React.ReactNode; hideSections?: boolean }) {
  return (
    <main className="article-page">
      <Breadcrumb className="article-breadcrumb">
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink render={<Link href="/" />}>Công cụ</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>{content.title}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <header className="article-hero">
        <div>
          <Badge variant="secondary">{content.kicker}</Badge>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
        </div>
        <nav className="article-index" aria-label="Mục lục">
          <strong>Trong bài này</strong>
          {content.sections.map(section => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
        </nav>
      </header>
      <div className="article-body">
        <Alert className="article-trust-alert">
          <Info weight="bold" />
          <AlertTitle>Lưu ý về an toàn</AlertTitle>
          <AlertDescription>Không gửi secret TOTP, recovery code hoặc mật khẩu cho người khác. Nội dung này nhằm hướng dẫn thực hành, không thay thế phương án khôi phục chính thức của dịch vụ.</AlertDescription>
        </Alert>
        {children}
        {!hideSections && content.sections.map((section, index) => (
          <section className="article-section" id={section.id} key={section.id}>
            {index > 0 && <Separator />}
            <h2>{section.title}</h2>
            {section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {section.bullets && <ul>{section.bullets.map(item => <li key={item}>{item}</li>)}</ul>}
          </section>
        ))}
        <section className="content-cta">
          <div><h2>Tạo mã ngay trên thiết bị</h2><p>Không cần tài khoản. Hãy đọc cảnh báo lưu trữ trước khi giữ secret trong trình duyệt.</p></div>
          <Button render={<Link href="/" />} size="lg">Mở MFA Tool<ArrowRight data-icon="inline-end" weight="bold" /></Button>
        </section>
      </div>
    </main>
  )
}
