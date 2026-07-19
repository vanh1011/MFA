import { useEffect, useMemo, useState } from 'react'
import { TOTP } from 'otpauth'
import { Check, Copy, Globe, Moon, Plus, ShieldCheck, Sun, Trash, WarningCircle, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import './App.css'
import './key-display.css'

type Language = 'vi' | 'en' | 'de'
type Theme = 'dark' | 'light'
type TotpAccount = { id: string; name: string; secret: string; period: number; digits: number; algorithm: string }

const text = {
  vi: { session: 'Không lưu khóa', clear: 'Xóa tất cả', title: 'Lấy mã 2FA', section: 'NHẬP KHÓA', addTitle: 'Dán khóa 2FA vào đây', hint: 'Mỗi dòng là một mã. Có thể dán nhiều khóa.', add: 'Lấy mã', emptyTitle: 'Chưa có mã nào', emptyText: 'Dán khóa 2FA ở trên, rồi bấm “Lấy mã”.', live: 'MÃ ĐANG HIỂN THỊ', expires: 'Đổi mã sau', copied: 'Đã copy', copy: 'Copy mã', remove: 'Xóa mã', privacy: 'Khóa chỉ được xử lý trên thiết bị của bạn.', keyRequired: 'Hãy dán khóa 2FA trước.', invalid: 'Khóa chưa đúng. Hãy kiểm tra và thử lại.', placeholder: 'Dán khóa 2FA vào đây\nBạn có thể dán nhiều khóa, mỗi khóa một dòng.', key: 'Khóa' },
  en: { session: 'Keys are not saved', clear: 'Clear all', title: 'Get 2FA codes', section: 'PASTE KEYS', addTitle: 'Paste your 2FA key here', hint: 'One line equals one code. You can paste multiple keys.', add: 'Get codes', emptyTitle: 'No codes yet', emptyText: 'Paste your 2FA key above, then choose “Get codes”.', live: 'CURRENT CODES', expires: 'Changes in', copied: 'Copied', copy: 'Copy code', remove: 'Remove code', privacy: 'Keys are processed only on your device.', keyRequired: 'Paste a 2FA key first.', invalid: 'This key does not look right. Check it and try again.', placeholder: 'Paste your 2FA key here\nYou can paste multiple keys, one per line.', key: 'Key' },
  de: { session: 'Schlüssel werden nicht gespeichert', clear: 'Alles löschen', title: '2FA-Codes abrufen', section: 'SCHLÜSSEL EINFÜGEN', addTitle: '2FA-Schlüssel hier einfügen', hint: 'Eine Zeile entspricht einem Code. Mehrere Schlüssel sind möglich.', add: 'Codes abrufen', emptyTitle: 'Noch keine Codes', emptyText: 'Füge oben deinen 2FA-Schlüssel ein und wähle „Codes abrufen“.', live: 'AKTUELLE CODES', expires: 'Ändert sich in', copied: 'Kopiert', copy: 'Code kopieren', remove: 'Code entfernen', privacy: 'Schlüssel werden nur auf deinem Gerät verarbeitet.', keyRequired: 'Füge zuerst einen 2FA-Schlüssel ein.', invalid: 'Dieser Schlüssel sieht nicht richtig aus. Bitte prüfe ihn.', placeholder: '2FA-Schlüssel hier einfügen\nMehrere Schlüssel sind möglich, einer pro Zeile.', key: 'Schlüssel' },
} as const

function parseLine(line: string, fallbackName: string): TotpAccount {
  const [label, ...parts] = line.split('|')
  const raw = parts.length ? parts.join('|').trim() : line.trim()
  let name = parts.length ? label.trim() : ''
  let secret = raw.replace(/\s/g, ''), period = 30, digits = 6, algorithm = 'SHA1'
  if (raw.startsWith('otpauth://')) {
    const uri = new URL(raw)
    if (uri.protocol !== 'otpauth:' || uri.hostname !== 'totp') throw new Error()
    const path = decodeURIComponent(uri.pathname.slice(1)).split(':')
    secret = uri.searchParams.get('secret')?.replace(/\s/g, '') ?? ''
    name = parts.length ? name : uri.searchParams.get('issuer') || path[0] || ''
    period = Number(uri.searchParams.get('period') ?? 30); digits = Number(uri.searchParams.get('digits') ?? 6); algorithm = uri.searchParams.get('algorithm') ?? 'SHA1'
  }
  if (!/^[A-Z2-7]+=*$/i.test(secret)) throw new Error()
  return { id: crypto.randomUUID(), name: name || `${fallbackName}: ${secret.toUpperCase()}`, secret, period, digits, algorithm }
}
function generate(account: TotpAccount) { return new TOTP({ secret: account.secret, period: account.period, digits: account.digits, algorithm: account.algorithm as 'SHA1' }).generate() }

function App() {
  const [language, setLanguage] = useState<Language>('vi')
  const [theme, setTheme] = useState<Theme>('light')
  const [input, setInput] = useState('')
  const [accounts, setAccounts] = useState<TotpAccount[]>([])
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [now, setNow] = useState(Date.now())
  const t = text[language]
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 350); return () => clearInterval(timer) }, [])
  const codes = useMemo(() => accounts.map(account => ({ account, code: generate(account) })), [accounts, now])
  const remaining = (period: number) => period - Math.floor(now / 1000) % period
  const formatCode = (code: string) => code.match(/.{1,3}/g)?.join(' ') ?? code
  function addCodes() { setError(''); const lines = input.split('\n').map(line => line.trim()).filter(Boolean); if (!lines.length) return setError(t.keyRequired); try { setAccounts(current => [...current, ...lines.map(line => parseLine(line, t.key))]); setInput('') } catch { setError(t.invalid) } }
  async function copyCode(account: TotpAccount, code: string) { await navigator.clipboard.writeText(code); setCopiedId(account.id); window.setTimeout(() => setCopiedId(null), 1300) }

  return <main className={`board-page ${theme}`}>
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><ShieldCheck size={20} weight="fill" /></span>Kira Tech 2FA</div>
      <div className="header-actions">
        <div className="language-switch" aria-label="Language"><Globe size={15}/>{(['vi', 'en', 'de'] as Language[]).map(item => <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>)}</div>
        <Button variant="ghost" size="icon-sm" className="theme-toggle" onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}</Button>
        <span className="session-note"><ShieldCheck size={15} weight="fill"/> {t.session}</span>
        {accounts.length > 0 && <Button variant="ghost" className="clear-button" onClick={() => setAccounts([])}><Trash size={16}/> {t.clear}</Button>}
      </div>
    </header>
    <section className="board-shell">
      <div className="board-heading"><h1>{t.title}</h1></div>
      <section className="composer" aria-label={t.addTitle}>
        <div className="composer-title"><div><span>{t.section}</span><b>{t.addTitle}</b></div></div>
        <Textarea value={input} onChange={e => setInput(e.target.value)} rows={3} spellCheck={false} autoComplete="off" placeholder={t.placeholder} className="batch-input" />
        {error && <p className="input-error"><WarningCircle size={16}/> {error}</p>}
        <div className="composer-footer"><span>{t.hint}</span><Button className="add-codes" onClick={addCodes}><Plus size={18} weight="bold"/> {t.add}</Button></div>
      </section>
      {accounts.length === 0 ? <section className="empty-board"><div className="empty-mark"><Plus size={24}/></div><h2>{t.emptyTitle}</h2><p>{t.emptyText}</p></section> : <section className="code-section"><div className="code-section-header"><span>{accounts.length} {t.live}</span></div><div className="code-grid">{codes.map(({ account, code }, index) => <article key={account.id} className="code-tile" style={{ '--index': index } as React.CSSProperties}><div className="tile-top"><span className="account-initial">{account.name.slice(0,1).toUpperCase()}</span><div><h2>{account.name}</h2><p>{t.expires} {remaining(account.period)}s</p></div><Button variant="ghost" size="icon-sm" className="remove-code" onClick={() => setAccounts(current => current.filter(item => item.id !== account.id))} aria-label={`${t.remove} ${account.name}`}><X size={17}/></Button></div><button className="code-button" onClick={() => copyCode(account, code)} aria-label={`${t.copy} ${account.name}`}><output>{formatCode(code)}</output><span>{copiedId === account.id ? <><Check size={16} weight="bold"/> {t.copied}</> : <><Copy size={16}/> {t.copy}</>}</span></button></article>)}</div></section>}
      <p className="privacy-note"><ShieldCheck size={17} weight="fill"/> {t.privacy}</p>
    </section>
  </main>
}
export default App
