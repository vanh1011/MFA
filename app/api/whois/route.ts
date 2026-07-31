import { NextResponse } from 'next/server'

type JsonObject = Record<string, any>
const normaliseDomain = (value: string) => value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]

export async function GET(request: Request) {
  const domain = normaliseDomain(new URL(request.url).searchParams.get('domain') ?? '')
  const key = process.env.IP2LOCATION_API_KEY
  if (!key) return NextResponse.json({ error: 'WHOIS lookup is not configured.' }, { status: 500 })
  if (!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)) return NextResponse.json({ error: 'A valid domain is required.' }, { status: 400 })
  const upstream = new URL('https://api.ip2whois.com/v2')
  upstream.searchParams.set('key', key)
  upstream.searchParams.set('domain', domain)
  upstream.searchParams.set('format', 'json')
  try {
    const response = await fetch(upstream, { cache: 'no-store' })
    const data = await response.json() as JsonObject
    if (!response.ok || data.error) return NextResponse.json({ error: data.error?.error_message ?? 'WHOIS lookup failed.' }, { status: 502 })
    return NextResponse.json({
      domain: data.domain, status: data.status, created: data.create_date, updated: data.update_date,
      expires: data.expire_date, age: data.domain_age, registrar: data.registrar?.name ?? '',
      registrarUrl: data.registrar?.url ?? '', nameservers: Array.isArray(data.nameservers) ? data.nameservers : [],
    })
  } catch {
    return NextResponse.json({ error: 'WHOIS service is unavailable.' }, { status: 502 })
  }
}
