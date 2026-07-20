import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import { TOTP } from 'otpauth'
import { ArrowRight, ArrowsClockwise, Check, Copy, CrosshairSimple, DownloadSimple, Globe, Key, MapPin, Moon, Network, Plus, ShieldCheck, Sun, Trash, WarningCircle, WifiHigh, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import './App.css'
import './key-display.css'

type Language = 'vi' | 'en' | 'de'
type Theme = 'dark' | 'light'
type View = 'totp' | 'ip' | 'domain'
type InstallPlatform = 'ios' | 'android' | 'desktop'
type TotpAccount = { id: string; name: string; secret: string; period: number; digits: number; algorithm: string }
type IpInfo = { version: 'IPv4' | 'IPv6'; ip: string; isp: string; org: string; asn: string; domain: string; city: string; region: string; country: string; timezone: string; latitude: number | null; longitude: number | null; connectionType: string; isVpn: boolean | null }
type DeviceLocation = { latitude: number; longitude: number; accuracy: number }
type WhoisResult = { domain: string; status: string; created: string; updated: string; expires: string; age: number | string; registrar: string; registrarUrl: string; nameservers: string[] }
type HostedResult = { ip: string; total: number; page: number; pages: number; domains: string[] }
type InstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }> }

const text = {
  vi: {
    totpTab: 'Mã 2FA', ipTab: 'Kiểm tra IP', session: 'Không lưu khóa', clear: 'Xóa tất cả', install: 'Cài app', installToast: 'Đã sẵn sàng cài ứng dụng', installTitle: 'Cài Kira Tech 2FA', installHint: 'Trên iPhone/iPad: mở trang bằng Safari, bấm Chia sẻ rồi chọn “Thêm vào Màn hình chính”. Trên Chrome/Edge: bấm “Cài app” để tiếp tục.', installClose: 'Đóng', title: 'Lấy mã 2FA', section: 'NHẬP KHÓA', addTitle: 'Dán khóa 2FA vào đây', hint: 'Mỗi dòng là một mã. Có thể dán nhiều khóa.', add: 'Lấy mã 2FA', addDescription: 'Mã tạo ngay trên thiết bị của bạn', emptyTitle: 'Chưa có mã nào', emptyText: 'Dán khóa 2FA ở trên, rồi bấm “Lấy mã 2FA”.', live: 'MÃ ĐANG HIỂN THỊ', expires: 'Đổi mã sau', copied: 'Đã copy', copy: 'Copy mã', remove: 'Xóa mã', privacy: 'Khóa chỉ được xử lý trên thiết bị của bạn.', keyRequired: 'Hãy dán khóa 2FA trước.', invalid: 'Khóa chưa đúng. Hãy kiểm tra và thử lại.', duplicateKeys: 'Khóa này đã có trên bảng, không thêm lại.', codeCopiedToast: 'Đã sao chép mã 2FA', ipCopiedToast: 'Đã sao chép địa chỉ IP', codesAddedToast: 'Đã tạo mã 2FA', placeholder: 'Dán khóa 2FA vào đây\nBạn có thể dán nhiều khóa, mỗi khóa một dòng.', key: 'Khóa',
    ipTitle: 'Kiểm tra IP của bạn', ipDescription: 'Xem IPv4, IPv6, vị trí và thông tin kết nối hiện tại.', yourIp: 'Địa chỉ IP của bạn', copyIp: 'Copy IP', refresh: 'Làm mới', deviceLocation: 'Lấy vị trí thiết bị', deviceLocationTitle: 'Vị trí thiết bị', deviceLocationHint: 'Chính xác hơn vị trí theo IP. Trình duyệt sẽ hỏi quyền truy cập.', deviceLocationError: 'Không thể lấy vị trí thiết bị. Hãy cho phép quyền Vị trí và thử lại.', accuracy: 'Độ chính xác', meters: 'm', network: 'Thông tin mạng', isp: 'Nhà mạng / ISP', organization: 'Tổ chức', asn: 'Mã ASN', domain: 'Tên miền / PTR', connection: 'Loại kết nối', location: 'Vị trí ước tính theo IP', coordinates: 'Tọa độ', openMap: 'Mở bản đồ', timezone: 'Múi giờ', vpn: 'Phát hiện VPN', vpnYes: 'Có thể đang dùng VPN', vpnNo: 'Không phát hiện VPN', vpnUnknown: 'Chưa xác định', ipv6Unavailable: 'Không phát hiện kết nối IPv6', ipLoading: 'Đang kiểm tra IPv4 và IPv6…', ipError: 'Không thể lấy thông tin IP. Hãy kiểm tra mạng rồi thử lại.', ipPrivacy: 'IP được gửi trực tiếp đến dịch vụ tra cứu IP để lấy thông tin nhà mạng và vị trí. Thành phố theo IP chỉ mang tính ước lượng.', unavailable: 'Chưa có dữ liệu',
    domainTab: 'Tên miền', domainTitle: 'Tra cứu tên miền', domainDescription: 'Xem thông tin WHOIS hoặc các domain được host trên một IP.', whoisTab: 'WHOIS domain', hostedTab: 'Hosted domains', domainPlaceholder: 'Nhập domain, ví dụ kira.tech', ipPlaceholder: 'Nhập IPv4 hoặc IPv6', lookup: 'Tra cứu', lookupError: 'Không tìm thấy dữ liệu. Kiểm tra lại giá trị rồi thử lại.', status: 'Trạng thái', created: 'Ngày đăng ký', updated: 'Cập nhật', domainExpires: 'Hết hạn', age: 'Tuổi domain', registrar: 'Nhà đăng ký', nameservers: 'Nameservers', hostedCount: 'Số domain trên IP', noDomains: 'Không tìm thấy domain nào.',
  },
  en: {
    totpTab: '2FA codes', ipTab: 'Check IP', session: 'Keys are not saved', clear: 'Clear all', install: 'Install app', installToast: 'Ready to install the app', installTitle: 'Install Kira Tech 2FA', installHint: 'On iPhone/iPad: open this site in Safari, tap Share, then “Add to Home Screen”. On Chrome/Edge: choose “Install app” to continue.', installClose: 'Close', title: 'Get 2FA codes', section: 'PASTE KEYS', addTitle: 'Paste your 2FA key here', hint: 'One line equals one code. You can paste multiple keys.', add: 'Get 2FA codes', addDescription: 'Generated on this device', emptyTitle: 'No codes yet', emptyText: 'Paste your 2FA key above, then choose “Get 2FA codes”.', live: 'CURRENT CODES', expires: 'Changes in', copied: 'Copied', copy: 'Copy code', remove: 'Remove code', privacy: 'Keys are processed only on your device.', keyRequired: 'Paste a 2FA key first.', invalid: 'This key does not look right. Check it and try again.', duplicateKeys: 'This key is already on the board.', codeCopiedToast: '2FA code copied', ipCopiedToast: 'IP address copied', codesAddedToast: '2FA codes generated', placeholder: 'Paste your 2FA key here\nYou can paste multiple keys, one per line.', key: 'Key',
    ipTitle: 'Check your IP', ipDescription: 'View IPv4, IPv6, location and current connection details.', yourIp: 'Your IP address', copyIp: 'Copy IP', refresh: 'Refresh', deviceLocation: 'Use device location', deviceLocationTitle: 'Device location', deviceLocationHint: 'More accurate than IP location. Your browser will ask for permission.', deviceLocationError: 'We could not retrieve your device location. Allow location access and try again.', accuracy: 'Accuracy', meters: 'm', network: 'Network details', isp: 'Network / ISP', organization: 'Organization', asn: 'ASN', domain: 'Domain / PTR', connection: 'Connection type', location: 'Approximate IP location', coordinates: 'Coordinates', openMap: 'Open map', timezone: 'Time zone', vpn: 'VPN detection', vpnYes: 'VPN may be in use', vpnNo: 'No VPN detected', vpnUnknown: 'Unknown', ipv6Unavailable: 'No IPv6 connection detected', ipLoading: 'Checking IPv4 and IPv6…', ipError: 'We could not retrieve your IP information. Check your connection and try again.', ipPrivacy: 'Your IP is sent directly to the IP lookup provider to retrieve network and location details. City-level IP location is only an estimate.', unavailable: 'Unavailable',
    domainTab: 'Domains', domainTitle: 'Domain lookup', domainDescription: 'View WHOIS data or domains hosted on an IP address.', whoisTab: 'Domain WHOIS', hostedTab: 'Hosted domains', domainPlaceholder: 'Enter a domain, e.g. kira.tech', ipPlaceholder: 'Enter an IPv4 or IPv6 address', lookup: 'Look up', lookupError: 'No data found. Check the value and try again.', status: 'Status', created: 'Created', updated: 'Updated', domainExpires: 'Expires', age: 'Domain age', registrar: 'Registrar', nameservers: 'Nameservers', hostedCount: 'Domains on this IP', noDomains: 'No domains found.',
  },
  de: {
    totpTab: '2FA-Codes', ipTab: 'IP prüfen', session: 'Schlüssel werden nicht gespeichert', clear: 'Alles löschen', install: 'App installieren', installToast: 'App kann installiert werden', installTitle: 'Kira Tech 2FA installieren', installHint: 'Auf iPhone/iPad: Seite in Safari öffnen, Teilen wählen und dann „Zum Home-Bildschirm“. Auf Chrome/Edge: „App installieren“ auswählen.', installClose: 'Schließen', title: '2FA-Codes abrufen', section: 'SCHLÜSSEL EINFÜGEN', addTitle: '2FA-Schlüssel hier einfügen', hint: 'Eine Zeile entspricht einem Code. Mehrere Schlüssel sind möglich.', add: '2FA-Codes abrufen', addDescription: 'Wird auf diesem Gerät erstellt', emptyTitle: 'Noch keine Codes', emptyText: 'Füge oben deinen 2FA-Schlüssel ein und wähle „2FA-Codes abrufen“.', live: 'AKTUELLE CODES', expires: 'Ändert sich in', copied: 'Kopiert', copy: 'Code kopieren', remove: 'Code entfernen', privacy: 'Schlüssel werden nur auf deinem Gerät verarbeitet.', keyRequired: 'Füge zuerst einen 2FA-Schlüssel ein.', invalid: 'Dieser Schlüssel sieht nicht richtig aus. Bitte prüfe ihn.', duplicateKeys: 'Dieser Schlüssel ist bereits vorhanden.', codeCopiedToast: '2FA-Code kopiert', ipCopiedToast: 'IP-Adresse kopiert', codesAddedToast: '2FA-Codes erstellt', placeholder: '2FA-Schlüssel hier einfügen\nMehrere Schlüssel sind möglich, einer pro Zeile.', key: 'Schlüssel',
    ipTitle: 'Deine IP prüfen', ipDescription: 'Zeige IPv4, IPv6, Standort und Verbindungsdetails.', yourIp: 'Deine IP-Adresse', copyIp: 'IP kopieren', refresh: 'Aktualisieren', deviceLocation: 'Gerätestandort verwenden', deviceLocationTitle: 'Gerätestandort', deviceLocationHint: 'Genauer als der IP-Standort. Dein Browser fragt nach Berechtigung.', deviceLocationError: 'Der Gerätestandort konnte nicht abgerufen werden. Erlaube Standortzugriff und versuche es erneut.', accuracy: 'Genauigkeit', meters: 'm', network: 'Netzwerkdetails', isp: 'Anbieter / ISP', organization: 'Organisation', asn: 'ASN', domain: 'Domain / PTR', connection: 'Verbindungstyp', location: 'Ungefährer IP-Standort', coordinates: 'Koordinaten', openMap: 'Karte öffnen', timezone: 'Zeitzone', vpn: 'VPN-Erkennung', vpnYes: 'VPN wird möglicherweise verwendet', vpnNo: 'Kein VPN erkannt', vpnUnknown: 'Unbekannt', ipv6Unavailable: 'Keine IPv6-Verbindung erkannt', ipLoading: 'IPv4 und IPv6 werden geprüft…', ipError: 'IP-Informationen konnten nicht geladen werden. Prüfe die Verbindung und versuche es erneut.', ipPrivacy: 'Deine IP wird direkt an den IP-Lookup-Anbieter gesendet, um Netzwerk- und Standortdaten abzurufen. Der IP-Stadtstandort ist nur eine Schätzung.', unavailable: 'Nicht verfügbar',
    domainTab: 'Domains', domainTitle: 'Domain-Suche', domainDescription: 'WHOIS-Daten oder auf einer IP gehostete Domains anzeigen.', whoisTab: 'Domain-WHOIS', hostedTab: 'Gehostete Domains', domainPlaceholder: 'Domain eingeben, z. B. kira.tech', ipPlaceholder: 'IPv4- oder IPv6-Adresse eingeben', lookup: 'Suchen', lookupError: 'Keine Daten gefunden. Prüfe den Wert und versuche es erneut.', status: 'Status', created: 'Registriert', updated: 'Aktualisiert', domainExpires: 'Läuft ab', age: 'Domain-Alter', registrar: 'Registrar', nameservers: 'Nameserver', hostedCount: 'Domains auf dieser IP', noDomains: 'Keine Domains gefunden.',
  },
} as const

const installCopy = {
  vi: {
    tabs: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Máy tính' },
    label: 'DÙNG NHƯ ỨNG DỤNG',
    steps: {
      ios: ['Mở trang này bằng Safari.', 'Bấm nút Chia sẻ ở thanh công cụ Safari.', 'Chọn “Thêm vào Màn hình chính”, rồi bấm “Thêm”.'],
      android: ['Mở trang này bằng Chrome.', 'Bấm menu ⋮ ở góc trên bên phải.', 'Chọn “Cài đặt ứng dụng” hoặc “Thêm vào Màn hình chính”.'],
      desktop: ['Mở trang này bằng Chrome hoặc Edge.', 'Bấm biểu tượng cài đặt ở thanh địa chỉ, hoặc mở menu trình duyệt.', 'Chọn “Cài app” để mở Kira Tech 2FA trong cửa sổ riêng.'],
    },
    tip: 'Không thấy tuỳ chọn? Hãy mở bằng trình duyệt Safari, Chrome hoặc Edge — không dùng tab trong Facebook, Zalo hay ứng dụng khác.',
  },
  en: {
    tabs: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Desktop' },
    label: 'USE AS AN APP',
    steps: {
      ios: ['Open this site in Safari.', 'Tap Share in Safari’s toolbar.', 'Choose “Add to Home Screen”, then tap “Add”.'],
      android: ['Open this site in Chrome.', 'Tap the ⋮ menu in the top-right corner.', 'Choose “Install app” or “Add to Home screen”.'],
      desktop: ['Open this site in Chrome or Edge.', 'Choose the install icon in the address bar, or open the browser menu.', 'Choose “Install app” to open Kira Tech 2FA in its own window.'],
    },
    tip: 'Do not see the option? Open the page in Safari, Chrome, or Edge — not an in-app browser such as Facebook or Zalo.',
  },
  de: {
    tabs: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Computer' },
    label: 'ALS APP VERWENDEN',
    steps: {
      ios: ['Öffne diese Seite in Safari.', 'Tippe auf Teilen in der Safari-Symbolleiste.', 'Wähle „Zum Home-Bildschirm“, dann „Hinzufügen“.'],
      android: ['Öffne diese Seite in Chrome.', 'Tippe oben rechts auf das Menü ⋮.', 'Wähle „App installieren“ oder „Zum Startbildschirm“.'],
      desktop: ['Öffne diese Seite in Chrome oder Edge.', 'Klicke auf das Installationssymbol in der Adressleiste oder öffne das Browser-Menü.', 'Wähle „App installieren“, um Kira Tech 2FA in einem eigenen Fenster zu öffnen.'],
    },
    tip: 'Keine Option sichtbar? Öffne die Seite in Safari, Chrome oder Edge — nicht in einem In-App-Browser wie Facebook oder Zalo.',
  },
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
    period = Number(uri.searchParams.get('period') ?? 30)
    digits = Number(uri.searchParams.get('digits') ?? 6)
    algorithm = uri.searchParams.get('algorithm') ?? 'SHA1'
  }
  if (!/^[A-Z2-7]+=*$/i.test(secret)) throw new Error()
  return { id: createAccountId(), name: name || `${fallbackName}: ${secret.toUpperCase()}`, secret, period, digits, algorithm }
}

function createAccountId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function generate(account: TotpAccount) {
  return new TOTP({ secret: account.secret, period: account.period, digits: account.digits, algorithm: account.algorithm as 'SHA1' }).generate()
}

function accountFingerprint(account: TotpAccount) {
  return `${account.secret.toUpperCase()}:${account.period}:${account.digits}:${account.algorithm.toUpperCase()}`
}

function uniqueAccounts(accounts: TotpAccount[]) {
  const seen = new Set<string>()
  return accounts.filter(account => {
    const fingerprint = accountFingerprint(account)
    if (seen.has(fingerprint)) return false
    seen.add(fingerprint)
    return true
  })
}

function detectInstallPlatform(): InstallPlatform {
  const userAgent = navigator.userAgent
  if (/iPad|iPhone|iPod/i.test(userAgent)) return 'ios'
  if (/Android/i.test(userAgent)) return 'android'
  return 'desktop'
}

function App() {
  const [language, setLanguage] = useState<Language>('vi')
  const [theme, setTheme] = useState<Theme>('light')
  const [view, setView] = useState<View>('totp')
  const [input, setInput] = useState('')
  const [accounts, setAccounts] = useState<TotpAccount[]>([])
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [installHelpOpen, setInstallHelpOpen] = useState(false)
  const [installPlatform, setInstallPlatform] = useState<InstallPlatform>(detectInstallPlatform)
  const [now, setNow] = useState(Date.now())
  const [ipv4Info, setIpv4Info] = useState<IpInfo | null>(null)
  const [ipv6Info, setIpv6Info] = useState<IpInfo | null>(null)
  const [ipLoading, setIpLoading] = useState(false)
  const [ipError, setIpError] = useState('')
  const [copiedIp, setCopiedIp] = useState<string | null>(null)
  const [deviceLocation, setDeviceLocation] = useState<DeviceLocation | null>(null)
  const [deviceLocationState, setDeviceLocationState] = useState<'idle' | 'loading' | 'error'>('idle')
  const [domainTool, setDomainTool] = useState<'whois' | 'hosted'>('whois')
  const [domainInput, setDomainInput] = useState('')
  const [domainLoading, setDomainLoading] = useState(false)
  const [domainError, setDomainError] = useState('')
  const [whoisResult, setWhoisResult] = useState<WhoisResult | null>(null)
  const [hostedResult, setHostedResult] = useState<HostedResult | null>(null)
  const t = text[language]
  const installGuide = installCopy[language]

  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 350); return () => clearInterval(timer) }, [])
  useEffect(() => { if (view === 'ip' && !ipv4Info && !ipLoading) void loadIp() }, [view])
  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  const codes = useMemo(() => accounts.map(account => ({ account, code: generate(account) })), [accounts, now])
  const remaining = (period: number) => period - Math.floor(now / 1000) % period
  const progress = (period: number) => Math.round((remaining(period) / period) * 100)
  const expiryTone = (period: number) => remaining(period) <= 2 ? 'urgent' : remaining(period) <= 5 ? 'warning' : 'normal'
  const formatCode = (code: string) => code.match(/.{1,3}/g)?.join(' ') ?? code

  async function lookupIp(version: IpInfo['version'], endpoint: string): Promise<IpInfo> {
    const addressResponse = endpoint ? await fetch(endpoint, { headers: { Accept: 'application/json' } }) : null
    const address = addressResponse ? await addressResponse.json() : null
    const ip = address?.ip
    if (addressResponse && (!addressResponse.ok || !ip)) throw new Error('IP address lookup failed')
    const query = new URLSearchParams({ lang: language })
    if (ip) query.set('ip', ip)
    const response = await fetch(`/api/ip?${query}`, { headers: { Accept: 'application/json' } })
    const data = await response.json()
    if (!response.ok || data.success === false || !data.ip) throw new Error(data.error ?? 'IP details lookup failed')
    return {
      version,
      ip: data.ip,
      isp: data.isp ?? '',
      org: data.org ?? '',
      asn: String(data.asn ?? ''),
      domain: data.domain ?? '',
      city: data.city ?? '',
      region: data.region ?? '',
      country: data.country ?? '',
      timezone: data.timezone ?? '',
      latitude: typeof data.latitude === 'number' ? data.latitude : null,
      longitude: typeof data.longitude === 'number' ? data.longitude : null,
      connectionType: data.connectionType ?? '',
      isVpn: typeof data.isVpn === 'boolean' ? data.isVpn : null,
    }
  }

  async function loadIp() {
    setIpLoading(true)
    setIpError('')
    setIpv4Info(null)
    setIpv6Info(null)
    try {
      const [ipv4, ipv6] = await Promise.allSettled([
        lookupIp('IPv4', import.meta.env.DEV ? 'https://api.ipify.org?format=json' : ''),
        lookupIp('IPv6', 'https://api6.ipify.org?format=json'),
      ])
      if (ipv4.status !== 'fulfilled') throw ipv4.reason instanceof Error ? ipv4.reason : new Error('IPv4 lookup failed')
      setIpv4Info(ipv4.value)
      if (ipv6.status === 'fulfilled') setIpv6Info(ipv6.value)
    } catch (error) {
      setIpError(error instanceof Error && error.message ? error.message : t.ipError)
    } finally {
      setIpLoading(false)
    }
  }

  function addCodes() {
    setError('')
    const lines = input.split('\n').map(line => line.trim()).filter(Boolean)
    if (!lines.length) return setError(t.keyRequired)
    try {
      const parsed = lines.map(line => parseLine(line, t.key))
      const known = new Set(accounts.map(accountFingerprint))
      const incoming = parsed.filter(account => {
        const fingerprint = accountFingerprint(account)
        if (known.has(fingerprint)) return false
        known.add(fingerprint)
        return true
      })
      if (!incoming.length) {
        setAccounts(current => uniqueAccounts(current))
        showToast(t.duplicateKeys)
        return
      }
      setAccounts(current => uniqueAccounts([...current, ...incoming]))
      setInput('')
      showToast(`${t.codesAddedToast}: ${incoming.length}`)
    } catch {
      setError(t.invalid)
    }
  }

  async function copyText(value: string, success: () => void) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable')
      await navigator.clipboard.writeText(value)
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = value
      fallback.setAttribute('readonly', '')
      fallback.style.position = 'fixed'
      fallback.style.opacity = '0'
      document.body.appendChild(fallback)
      fallback.select()
      fallback.setSelectionRange(0, value.length)
      document.execCommand('copy')
      fallback.remove()
    }
    success()
  }

  function showToast(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(current => current === message ? null : current), 2200)
  }

  async function installApp() {
    if (!installPrompt) {
      setInstallHelpOpen(true)
      return
    }
    await installPrompt.prompt()
    const result = await installPrompt.userChoice
    if (result.outcome === 'accepted') showToast(t.installToast)
    setInstallPrompt(null)
  }

  function copyCode(account: TotpAccount, code: string) {
    void copyText(code, () => { setCopiedId(account.id); showToast(t.codeCopiedToast); window.setTimeout(() => setCopiedId(null), 1300) })
  }

  function copyIp(ip: string) {
    void copyText(ip, () => { setCopiedIp(ip); showToast(t.ipCopiedToast); window.setTimeout(() => setCopiedIp(null), 1300) })
  }

  function getDeviceLocation() {
    if (!navigator.geolocation) return setDeviceLocationState('error')
    setDeviceLocationState('loading')
    navigator.geolocation.getCurrentPosition(
      position => {
        setDeviceLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy })
        setDeviceLocationState('idle')
      },
      () => setDeviceLocationState('error'),
      { enableHighAccuracy: true, timeout: 12_000, maximumAge: 60_000 },
    )
  }

  async function lookupDomainTool() {
    const value = domainInput.trim()
    if (!value) return
    setDomainLoading(true)
    setDomainError('')
    setWhoisResult(null)
    setHostedResult(null)
    try {
      const endpoint = domainTool === 'whois' ? `/api/whois?domain=${encodeURIComponent(value)}` : `/api/hosted-domains?ip=${encodeURIComponent(value)}`
      const response = await fetch(endpoint)
      const data = await response.json()
      if (!response.ok || data.error) throw new Error(data.error)
      if (domainTool === 'whois') setWhoisResult(data as WhoisResult)
      else setHostedResult(data as HostedResult)
    } catch {
      setDomainError(t.lookupError)
    } finally {
      setDomainLoading(false)
    }
  }

  const reports = [ipv4Info, ipv6Info].filter((info): info is IpInfo => Boolean(info))

  return <main className={`board-page ${theme}`}>
    <header className="topbar">
      <div className="brand"><span className="brand-mark"><ShieldCheck size={20} weight="fill" /></span>Kira Tech 2FA</div>
      <div className="header-actions">
        <nav className="tool-switch" aria-label="Tools">
          <button className={view === 'totp' ? 'active' : ''} onClick={() => setView('totp')}><ShieldCheck size={15} weight="fill" />{t.totpTab}</button>
          <button className={view === 'ip' ? 'active' : ''} onClick={() => setView('ip')}><Globe size={15} />{t.ipTab}</button>
          <button className={view === 'domain' ? 'active' : ''} onClick={() => setView('domain')}><Network size={15} />{t.domainTab}</button>
        </nav>
        <div className="language-switch" aria-label="Language"><Globe size={15}/>{(['vi', 'en', 'de'] as Language[]).map(item => <button key={item} className={language === item ? 'active' : ''} onClick={() => setLanguage(item)}>{item.toUpperCase()}</button>)}</div>
        <label className="mobile-language"><Globe size={17}/><select value={language} onChange={event => setLanguage(event.target.value as Language)} aria-label="Language"><option value="vi">VI · Tiếng Việt</option><option value="en">EN · English</option><option value="de">DE · Deutsch</option></select></label>
        <Button variant="ghost" size="icon-sm" className="theme-toggle" onClick={() => setTheme(current => current === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">{theme === 'dark' ? <Sun size={17}/> : <Moon size={17}/>}</Button>
        {view === 'totp' && <><Button variant="outline" className="install-button" onClick={() => void installApp()}><DownloadSimple size={16} weight="bold"/>{t.install}</Button><span className="session-note"><ShieldCheck size={15} weight="fill"/> {t.session}</span>{accounts.length > 0 && <Button variant="ghost" className="clear-button" onClick={() => setAccounts([])}><Trash size={16}/> {t.clear}</Button>}</>}
      </div>
    </header>

    {view === 'totp' ? <section className="board-shell">
      <div className="board-heading"><h1>{t.title}</h1></div>
      <section className="composer" aria-label={t.addTitle}>
        <aside className="composer-aside">
          <span className="composer-icon"><Key size={21} weight="bold"/></span>
          <span className="composer-step">01</span>
          <span className="composer-eyebrow">{t.section}</span>
          <h2>{t.addTitle}</h2>
          <p>{t.addDescription}</p>
          <span className="local-badge"><span className="local-badge-icon"><ShieldCheck size={14} weight="fill"/></span><span>{t.session}</span></span>
        </aside>
        <div className="composer-form">
          <label className="paste-label" htmlFor="totp-keys">{t.addTitle}</label>
          <Textarea id="totp-keys" value={input} onChange={e => setInput(e.target.value)} rows={4} spellCheck={false} autoComplete="off" placeholder={t.placeholder} className="batch-input" />
          {error && <p className="input-error"><WarningCircle size={16}/> {error}</p>}
          <div className="composer-footer"><span>{t.hint}</span><Button className="add-codes primary-action" onClick={addCodes}><span className="button-icon"><Plus size={18} weight="bold"/></span>{t.add}<ArrowRight size={17} weight="bold"/></Button></div>
        </div>
      </section>
      {accounts.length === 0 ? <section className="empty-board"><div className="empty-mark"><Plus size={24}/></div><h2>{t.emptyTitle}</h2><p>{t.emptyText}</p></section> : <section className="code-section"><div className="code-section-header"><span>{accounts.length} {t.live}</span></div><div className="code-grid">{codes.map(({ account, code }, index) => { const seconds = remaining(account.period); return <article key={account.id} className="code-tile" style={{ '--index': index } as CSSProperties}><div className="tile-top"><span className="account-initial">{account.name.slice(0,1).toUpperCase()}</span><div><h2>{account.name}</h2><p>{t.expires} {seconds}s</p></div><div className={`expiry-ring ${expiryTone(account.period)}`} aria-label={`${t.expires} ${seconds}s`}><svg viewBox="0 0 36 36" aria-hidden="true"><circle className="expiry-ring-track" cx="18" cy="18" r="15.5" pathLength="100"/><circle className="expiry-ring-value" cx="18" cy="18" r="15.5" pathLength="100" strokeDasharray="100" strokeDashoffset={100 - progress(account.period)}/></svg><strong>{seconds}</strong></div><Button variant="ghost" size="icon-sm" className="remove-code" onClick={() => setAccounts(current => current.filter(item => item.id !== account.id))} aria-label={`${t.remove} ${account.name}`}><X size={17}/></Button></div><button className="code-button" onClick={() => copyCode(account, code)} aria-label={`${t.copy} ${account.name}`}><output>{formatCode(code)}</output><span>{copiedId === account.id ? <><Check size={16} weight="bold"/> {t.copied}</> : <><Copy size={16}/> {t.copy}</>}</span></button></article>})}</div></section>}
      <p className="privacy-note"><ShieldCheck size={17} weight="fill"/> {t.privacy}</p>
    </section> : view === 'ip' ? <section className="board-shell ip-page">
      <div className="board-heading ip-heading"><div><h1>{t.ipTitle}</h1><p>{t.ipDescription}</p></div><div className="ip-actions"><Button variant="outline" className="refresh-button" onClick={getDeviceLocation} disabled={deviceLocationState === 'loading'}><CrosshairSimple size={17} className={deviceLocationState === 'loading' ? 'spin' : ''}/>{t.deviceLocation}</Button><Button variant="outline" className="refresh-button" onClick={() => void loadIp()} disabled={ipLoading}><ArrowsClockwise size={17} className={ipLoading ? 'spin' : ''}/>{t.refresh}</Button></div></div>
      {deviceLocation && <DeviceLocationCard location={deviceLocation} labels={{ title: t.deviceLocationTitle, hint: t.deviceLocationHint, coordinates: t.coordinates, accuracy: t.accuracy, meters: t.meters, openMap: t.openMap }} />}
      {deviceLocationState === 'error' && <p className="device-location-error"><WarningCircle size={16}/>{t.deviceLocationError}</p>}
      {ipLoading ? <section className="ip-status"><ArrowsClockwise size={22} className="spin"/><span>{t.ipLoading}</span></section> : ipError ? <section className="ip-status error"><WarningCircle size={22}/><span>{ipError}</span><Button className="add-codes" onClick={() => void loadIp()}>{t.refresh}</Button></section> : reports.map(info => <IpReport key={info.version} info={info} copied={copiedIp === info.ip} onCopy={() => copyIp(info.ip)} labels={{ yourIp: t.yourIp, copyIp: t.copyIp, copied: t.copied, network: t.network, isp: t.isp, organization: t.organization, asn: t.asn, domain: t.domain, connection: t.connection, location: t.location, coordinates: t.coordinates, openMap: t.openMap, timezone: t.timezone, vpn: t.vpn, vpnYes: t.vpnYes, vpnNo: t.vpnNo, vpnUnknown: t.vpnUnknown, unavailable: t.unavailable }} />)}
      {!ipLoading && !ipError && !ipv6Info && <section className="ipv6-empty"><Network size={20} weight="bold"/><div><strong>IPv6</strong><span>{t.ipv6Unavailable}</span></div></section>}
      {!ipLoading && !ipError && reports.length > 0 && <>
        <p className="ip-privacy"><Network size={17} weight="bold"/>{t.ipPrivacy}</p>
      </>}
    </section> : <section className="board-shell domain-page">
      <div className="board-heading"><div><h1>{t.domainTitle}</h1><p className="domain-description">{t.domainDescription}</p></div></div>
      <section className="domain-composer">
        <div className="domain-tool-tabs"><button className={domainTool === 'whois' ? 'active' : ''} onClick={() => { setDomainTool('whois'); setDomainInput(''); setDomainError(''); setWhoisResult(null); setHostedResult(null) }}>{t.whoisTab}</button><button className={domainTool === 'hosted' ? 'active' : ''} onClick={() => { setDomainTool('hosted'); setDomainInput(''); setDomainError(''); setWhoisResult(null); setHostedResult(null) }}>{t.hostedTab}</button></div>
        <div className="domain-search"><Input value={domainInput} onChange={event => setDomainInput(event.target.value)} onKeyDown={event => { if (event.key === 'Enter') void lookupDomainTool() }} placeholder={domainTool === 'whois' ? t.domainPlaceholder : t.ipPlaceholder} /><Button className="add-codes" onClick={() => void lookupDomainTool()} disabled={domainLoading}>{domainLoading ? <ArrowsClockwise size={17} className="spin"/> : <Globe size={17}/>} {t.lookup}</Button></div>
        {domainError && <p className="input-error"><WarningCircle size={16}/>{domainError}</p>}
      </section>
      {whoisResult && <section className="domain-result"><div className="domain-result-title"><span>{t.whoisTab}</span><h2>{whoisResult.domain}</h2></div><div className="ip-grid"><InfoCard label={t.status} value={whoisResult.status || t.unavailable} /><InfoCard label={t.created} value={whoisResult.created || t.unavailable} /><InfoCard label={t.updated} value={whoisResult.updated || t.unavailable} /><InfoCard label={t.domainExpires} value={whoisResult.expires || t.unavailable} /><InfoCard label={t.age} value={whoisResult.age ? String(whoisResult.age) : t.unavailable} /><InfoCard label={t.registrar} value={whoisResult.registrar || t.unavailable} /></div><div className="nameservers"><span>{t.nameservers}</span>{whoisResult.nameservers.length ? <ul>{whoisResult.nameservers.map(item => <li key={item}>{item}</li>)}</ul> : <strong>{t.unavailable}</strong>}</div></section>}
      {hostedResult && <section className="domain-result"><div className="domain-result-title"><span>{t.hostedTab}</span><h2>{hostedResult.ip}</h2></div><div className="ip-grid"><InfoCard label={t.hostedCount} value={String(hostedResult.total ?? 0)} /><InfoCard label="Page" value={`${hostedResult.page ?? 1} / ${hostedResult.pages ?? 1}`} /></div><div className="nameservers"><span>{t.domainTab}</span>{hostedResult.domains.length ? <ul>{hostedResult.domains.map(item => <li key={item}>{item}</li>)}</ul> : <strong>{t.noDomains}</strong>}</div></section>}
    </section>}
    {toast && <div className="toast-notification" role="status"><span><Check size={18} weight="bold"/></span>{toast}</div>}
    {installHelpOpen && <div className="install-dialog-backdrop" role="presentation" onClick={() => setInstallHelpOpen(false)}><section className="install-dialog" role="dialog" aria-modal="true" aria-labelledby="install-dialog-title" onClick={event => event.stopPropagation()}><div className="install-dialog-handle"/><Button variant="ghost" size="icon-sm" className="install-dialog-close" onClick={() => setInstallHelpOpen(false)} aria-label={t.installClose}><X size={18}/></Button><span className="install-dialog-icon"><DownloadSimple size={22} weight="bold"/></span><span className="install-dialog-label">{installGuide.label}</span><h2 id="install-dialog-title">{t.installTitle}</h2><div className="install-tabs" role="tablist">{(['ios', 'android', 'desktop'] as InstallPlatform[]).map(platform => <button key={platform} className={installPlatform === platform ? 'active' : ''} onClick={() => setInstallPlatform(platform)} role="tab" aria-selected={installPlatform === platform}>{installGuide.tabs[platform]}</button>)}</div><ol className="install-steps">{installGuide.steps[installPlatform].map((step, index) => <li key={step}><span className="install-step-number">{index + 1}</span><span>{step}</span><span className="install-step-icon">{index === 0 ? <Globe size={20}/> : index === 1 ? <Plus size={21}/> : <Check size={20} weight="bold"/>}</span></li>)}</ol><p className="install-tip">{installGuide.tip}</p></section></div>}
  </main>
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return <article className="ip-card"><span>{label}</span><strong>{value}</strong></article>
}

function DeviceLocationCard({ location, labels }: { location: DeviceLocation; labels: { title: string; hint: string; coordinates: string; accuracy: string; meters: string; openMap: string } }) {
  const coordinates = `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`
  const mapUrl = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}#map=15/${location.latitude}/${location.longitude}`
  return <section className="device-location-card"><div className="device-location-title"><CrosshairSimple size={20} weight="bold"/><div><strong>{labels.title}</strong><span>{labels.hint}</span></div></div><div className="device-location-details"><InfoCard label={labels.coordinates} value={coordinates} /><InfoCard label={labels.accuracy} value={`± ${Math.round(location.accuracy)} ${labels.meters}`} /></div><a className="map-link" href={mapUrl} target="_blank" rel="noreferrer">{labels.openMap} ↗</a></section>
}

function IpReport({ info, copied, onCopy, labels }: { info: IpInfo; copied: boolean; onCopy: () => void; labels: { yourIp: string; copyIp: string; copied: string; network: string; isp: string; organization: string; asn: string; domain: string; connection: string; location: string; coordinates: string; openMap: string; timezone: string; vpn: string; vpnYes: string; vpnNo: string; vpnUnknown: string; unavailable: string } }) {
  const field = (value: string) => value || labels.unavailable
  const location = [info.city, info.region, info.country].filter(Boolean).join(', ')
  const coordinates = info.latitude !== null && info.longitude !== null ? `${info.latitude.toFixed(5)}, ${info.longitude.toFixed(5)}` : ''
  const mapUrl = coordinates ? `https://www.openstreetmap.org/?mlat=${info.latitude}&mlon=${info.longitude}#map=11/${info.latitude}/${info.longitude}` : ''
  return <section className="ip-report">
    <section className="ip-hero"><div><span>{info.version} · {labels.yourIp}</span><output>{info.ip}</output></div><Button className="add-codes copy-ip" onClick={onCopy}>{copied ? <Check size={17} weight="bold"/> : <Copy size={17}/>} {copied ? labels.copied : labels.copyIp}</Button></section>
    <section className="ip-section"><h2><WifiHigh size={19} weight="bold"/>{info.version} · {labels.network}</h2><div className="ip-grid"><InfoCard label={labels.isp} value={field(info.isp)} /><InfoCard label={labels.organization} value={field(info.org)} /><InfoCard label={labels.asn} value={info.asn ? `AS${info.asn}` : labels.unavailable} /><InfoCard label={labels.domain} value={field(info.domain)} /><InfoCard label={labels.connection} value={field(info.connectionType)} /></div></section>
    <section className="ip-section"><h2><MapPin size={19} weight="fill"/>{info.version} · {labels.location}</h2><div className="ip-grid"><InfoCard label={labels.location} value={field(location)} /><InfoCard label={labels.coordinates} value={field(coordinates)} /><InfoCard label={labels.timezone} value={field(info.timezone)} /><InfoCard label={labels.vpn} value={info.isVpn === true ? labels.vpnYes : info.isVpn === false ? labels.vpnNo : labels.vpnUnknown} /></div>{mapUrl && <a className="map-link" href={mapUrl} target="_blank" rel="noreferrer">{labels.openMap} ↗</a>}</section>
  </section>
}

export default App
