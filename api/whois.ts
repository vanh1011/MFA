import type { IncomingMessage, ServerResponse } from 'node:http'

type JsonObject = Record<string, any>

function send(response: ServerResponse, status: number, data: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'private, no-store')
  response.end(JSON.stringify(data))
}

function normaliseDomain(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? '/', 'https://local.invalid')
  const domain = normaliseDomain(url.searchParams.get('domain') ?? '')
  const key = process.env.IP2LOCATION_API_KEY
  if (!key) return send(response, 500, { error: 'WHOIS lookup is not configured.' })
  if (!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)) return send(response, 400, { error: 'A valid domain is required.' })

  const upstream = new URL('https://api.ip2whois.com/v2')
  upstream.searchParams.set('key', key)
  upstream.searchParams.set('domain', domain)
  upstream.searchParams.set('format', 'json')

  try {
    const result = await fetch(upstream)
    const data = await result.json() as JsonObject
    if (!result.ok || data.error) return send(response, 502, { error: data.error?.error_message ?? 'WHOIS lookup failed.' })
    return send(response, 200, {
      domain: data.domain,
      status: data.status,
      created: data.create_date,
      updated: data.update_date,
      expires: data.expire_date,
      age: data.domain_age,
      registrar: data.registrar?.name ?? '',
      registrarUrl: data.registrar?.url ?? '',
      nameservers: Array.isArray(data.nameservers) ? data.nameservers : [],
    })
  } catch {
    return send(response, 502, { error: 'WHOIS service is unavailable.' })
  }
}
