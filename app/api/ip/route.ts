import { isIP } from 'node:net'
import { NextResponse } from 'next/server'

type JsonObject = Record<string, any>
const languages = new Set(['vi', 'en', 'de'])

async function lookup(upstream: URL) {
  const response = await fetch(upstream, { cache: 'no-store' })
  const data = await response.json() as JsonObject
  return { response, data, message: String(data.error?.error_message ?? data.error ?? '').toLowerCase() }
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const forwardedIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = url.searchParams.get('ip')?.trim() || forwardedIp || ''
  const lang = url.searchParams.get('lang') ?? 'en'
  const key = process.env.IP2LOCATION_API_KEY
  if (!key) return NextResponse.json({ error: 'IP lookup is not configured.' }, { status: 500 })
  if (!isIP(ip)) return NextResponse.json({ error: 'A valid IPv4 or IPv6 address is required.' }, { status: 400 })

  const upstream = new URL('https://api.ip2location.io/')
  upstream.searchParams.set('key', key)
  upstream.searchParams.set('ip', ip)
  upstream.searchParams.set('format', 'json')
  if (languages.has(lang)) upstream.searchParams.set('lang', lang)

  try {
    let { response, data, message } = await lookup(upstream)
    if (!response.ok && message.includes('translation is not available') && upstream.searchParams.has('lang')) {
      upstream.searchParams.delete('lang')
      ;({ response, data, message } = await lookup(upstream))
    }
    if (!response.ok || data.error) return NextResponse.json({ error: data.error?.error_message ?? 'IP lookup failed.' }, { status: 502 })
    return NextResponse.json({
      ip: data.ip, isp: data.isp ?? '', org: data.as ?? data.as_info?.as_name ?? '',
      asn: String(data.asn ?? data.as_info?.as_number ?? ''), domain: data.domain ?? data.as_info?.as_domain ?? '',
      city: data.city_name ?? data.city?.name ?? '', region: data.region_name ?? data.region?.name ?? '',
      country: data.country_name ?? data.country?.name ?? '', timezone: data.time_zone_info?.olson ?? data.time_zone ?? '',
      latitude: typeof data.latitude === 'number' ? data.latitude : null,
      longitude: typeof data.longitude === 'number' ? data.longitude : null,
      connectionType: data.usage_type ?? data.as_info?.as_usage_type ?? '',
      isVpn: typeof data.proxy?.is_vpn === 'boolean' ? data.proxy.is_vpn : null,
    })
  } catch {
    return NextResponse.json({ error: 'IP lookup service is unavailable.' }, { status: 502 })
  }
}
