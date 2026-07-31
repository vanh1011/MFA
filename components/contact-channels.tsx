import { EnvelopeSimple, TelegramLogo, YoutubeLogo } from '@phosphor-icons/react/dist/ssr'
import { Button } from '@/components/ui/button'

export function ContactChannels() {
  return (
    <section className="contact-channels" aria-label="Các kênh liên hệ">
      <div>
        <span>Kênh hỗ trợ</span>
        <h2>Liên hệ Kira Tech</h2>
        <p>Không gửi secret TOTP, recovery code hoặc mật khẩu qua bất kỳ kênh nào.</p>
      </div>
      <div className="contact-channel-actions">
        <Button render={<a href="https://t.me/kiratech1011" target="_blank" rel="noreferrer" />} variant="outline" size="lg">
          <TelegramLogo data-icon="inline-start" weight="fill" />Telegram
        </Button>
        <Button render={<a href="https://www.youtube.com/@KiraTechTKpremium" target="_blank" rel="noreferrer" />} variant="outline" size="lg">
          <YoutubeLogo data-icon="inline-start" weight="fill" />YouTube
        </Button>
        <Button render={<a href="mailto:kira10111907@gmail.com" />} variant="outline" size="lg">
          <EnvelopeSimple data-icon="inline-start" weight="bold" />Email
        </Button>
      </div>
    </section>
  )
}
