import type { IncomingMessage, ServerResponse } from 'node:http'
import { isIP } from 'node:net'

type JsonObject = Record<string, any>

function send(response: ServerResponse, status: number, data: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'private, no-store')
  response.end(JSON.stringify(data))
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? '/', 'https://local.invalid')
  const ip = url.searchParams.get('ip')?.trim() ?? ''
  const page = Math.max(1, Math.min(100, Number(url.searchParams.get('page') ?? 1) || 1))
  const key = process.env.IP2LOCATION_API_KEY
  if (!key) return send(response, 500, { error: 'Hosted domain lookup is not configured.' })
  if (!isIP(ip)) return send(response, 400, { error: 'A valid IPv4 or IPv6 address is required.' })

  const upstream = new URL('https://domains.ip2whois.com/domains')
  upstream.searchParams.set('key', key)
  upstream.searchParams.set('ip', ip)
  upstream.searchParams.set('page', String(page))
  upstream.searchParams.set('format', 'json')

  try {
    const result = await fetch(upstream)
    const data = await result.json() as JsonObject
    if (!result.ok || data.error) return send(response, 502, { error: data.error?.error_message ?? 'Hosted domain lookup failed.' })
    return send(response, 200, { ip: data.ip, total: data.total_domains, page: data.page, pages: data.total_pages, domains: Array.isArray(data.domains) ? data.domains : [] })
  } catch {
    return send(response, 502, { error: 'Hosted domain service is unavailable.' })
  }
}
