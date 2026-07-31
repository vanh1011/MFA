import type { IncomingMessage, ServerResponse } from 'node:http'
import { isIP } from 'node:net'

type JsonObject = Record<string, any>

const languages = new Set(['vi', 'en', 'de'])
const unsupportedTranslationMessage = 'translation is not available'

function send(response: ServerResponse, status: number, data: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'private, no-store')
  response.end(JSON.stringify(data))
}

async function lookupIp(upstream: URL) {
  const result = await fetch(upstream)
  const data = await result.json() as JsonObject
  const errorMessage = String(data.error?.error_message ?? data.error ?? '').toLowerCase()
  return { result, data, errorMessage }
}

export default async function handler(request: IncomingMessage, response: ServerResponse) {
  const url = new URL(request.url ?? '/', 'https://local.invalid')
  const forwardedFor = request.headers['x-forwarded-for']
  const forwardedIp = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0]
  const ip = url.searchParams.get('ip')?.trim() || forwardedIp?.trim() || ''
  const lang = url.searchParams.get('lang') ?? 'en'
  const key = process.env.IP2LOCATION_API_KEY

  if (!key) return send(response, 500, { error: 'IP lookup is not configured.' })
  if (!isIP(ip)) return send(response, 400, { error: 'A valid IPv4 or IPv6 address is required.' })

  const upstream = new URL('https://api.ip2location.io/')
  upstream.searchParams.set('key', key)
  upstream.searchParams.set('ip', ip)
  upstream.searchParams.set('format', 'json')
  if (languages.has(lang)) upstream.searchParams.set('lang', lang)

  try {
    let { result, data, errorMessage } = await lookupIp(upstream)
    if (!result.ok && errorMessage.includes(unsupportedTranslationMessage) && upstream.searchParams.has('lang')) {
      upstream.searchParams.delete('lang')
      ;({ result, data, errorMessage } = await lookupIp(upstream))
    }
    if (!result.ok || data.error) return send(response, 502, { error: data.error?.error_message ?? 'IP lookup failed.' })

    return send(response, 200, {
      ip: data.ip,
      isp: data.isp ?? '',
      org: data.as ?? data.as_info?.as_name ?? '',
      asn: String(data.asn ?? data.as_info?.as_number ?? ''),
      domain: data.domain ?? data.as_info?.as_domain ?? '',
      city: data.city_name ?? data.city?.name ?? '',
      region: data.region_name ?? data.region?.name ?? '',
      country: data.country_name ?? data.country?.name ?? '',
      timezone: data.time_zone_info?.olson ?? data.time_zone ?? '',
      latitude: typeof data.latitude === 'number' ? data.latitude : null,
      longitude: typeof data.longitude === 'number' ? data.longitude : null,
      connectionType: data.usage_type ?? data.as_info?.as_usage_type ?? '',
      isVpn: typeof data.proxy?.is_vpn === 'boolean' ? data.proxy.is_vpn : null,
    })
  } catch {
    return send(response, 502, { error: 'IP lookup service is unavailable.' })
  }
}
