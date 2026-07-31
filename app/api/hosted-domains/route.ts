import { isIP } from 'node:net'
import { NextResponse } from 'next/server'

type JsonObject = Record<string, any>

export async function GET(request: Request) {
  const url = new URL(request.url)
  const ip = url.searchParams.get('ip')?.trim() ?? ''
  const page = Math.max(1, Math.min(100, Number(url.searchParams.get('page') ?? 1) || 1))
  const key = process.env.IP2LOCATION_API_KEY
  if (!key) return NextResponse.json({ error: 'Hosted domain lookup is not configured.' }, { status: 500 })
  if (!isIP(ip)) return NextResponse.json({ error: 'A valid IPv4 or IPv6 address is required.' }, { status: 400 })
  const upstream = new URL('https://domains.ip2whois.com/domains')
  upstream.searchParams.set('key', key)
  upstream.searchParams.set('ip', ip)
  upstream.searchParams.set('page', String(page))
  upstream.searchParams.set('format', 'json')
  try {
    const response = await fetch(upstream, { cache: 'no-store' })
    const data = await response.json() as JsonObject
    if (!response.ok || data.error) return NextResponse.json({ error: data.error?.error_message ?? 'Hosted domain lookup failed.' }, { status: 502 })
    return NextResponse.json({
      ip: data.ip, total: data.total_domains, page: data.page,
      pages: data.total_pages, domains: Array.isArray(data.domains) ? data.domains : [],
    })
  } catch {
    return NextResponse.json({ error: 'Hosted domain service is unavailable.' }, { status: 502 })
  }
}
