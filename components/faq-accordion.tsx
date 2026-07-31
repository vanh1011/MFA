'use client'

import { Question } from '@phosphor-icons/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import type { Section } from '../content/site-content'

export function FaqAccordion({ sections }: { sections: Section[] }) {
  return (
    <section className="faq-block" aria-label="Câu hỏi thường gặp">
      <div className="faq-block-heading">
        <Badge variant="secondary"><Question data-icon="inline-start" weight="bold" />{sections.length} câu hỏi</Badge>
        <p>Chọn từng câu hỏi để xem câu trả lời. Bạn có thể mở nhiều mục cùng lúc.</p>
      </div>
      <Accordion multiple defaultValue={[sections[0]?.id]} className="faq-accordion">
        {sections.map(section => (
          <AccordionItem value={section.id} key={section.id} id={section.id} className="faq-accordion-item">
            <AccordionTrigger className="faq-accordion-trigger">{section.title}</AccordionTrigger>
            <AccordionContent className="faq-accordion-content">
              {section.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  )
}
