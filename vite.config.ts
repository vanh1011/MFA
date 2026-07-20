import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { isIP } from 'node:net'
import path from 'node:path'

function send(response: import('node:http').ServerResponse, status: number, data: unknown) {
  response.statusCode = status
  response.setHeader('Content-Type', 'application/json; charset=utf-8')
  response.setHeader('Cache-Control', 'private, no-store')
  response.end(JSON.stringify(data))
}

function localApi(key: string): Plugin {
  return {
    name: 'local-ip2location-api',
    configureServer(server) {
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost')
        if (!url.pathname.startsWith('/api/')) return next()
        if (!key) return send(response, 500, { error: 'IP2LOCATION_API_KEY is missing from .env.' })

        try {
          if (url.pathname === '/api/ip') {
            const ip = url.searchParams.get('ip')?.trim() ?? ''
            if (!isIP(ip)) return send(response, 400, { error: 'A valid IPv4 or IPv6 address is required.' })
            const upstream = new URL('https://api.ip2location.io/')
            upstream.searchParams.set('key', key)
            upstream.searchParams.set('ip', ip)
            upstream.searchParams.set('format', 'json')
            const result = await fetch(upstream)
            const data: any = await result.json()
            if (!result.ok || data.error) return send(response, 502, { error: data.error?.error_message ?? 'IP lookup failed.' })
            return send(response, 200, { ip: data.ip, isp: data.isp ?? '', org: data.as ?? data.as_info?.as_name ?? '', asn: String(data.asn ?? data.as_info?.as_number ?? ''), domain: data.domain ?? data.as_info?.as_domain ?? '', city: data.city_name ?? data.city?.name ?? '', region: data.region_name ?? data.region?.name ?? '', country: data.country_name ?? data.country?.name ?? '', timezone: data.time_zone_info?.olson ?? data.time_zone ?? '', latitude: typeof data.latitude === 'number' ? data.latitude : null, longitude: typeof data.longitude === 'number' ? data.longitude : null, connectionType: data.usage_type ?? data.as_info?.as_usage_type ?? '', isVpn: typeof data.proxy?.is_vpn === 'boolean' ? data.proxy.is_vpn : null })
          }

          if (url.pathname === '/api/whois') {
            const domain = (url.searchParams.get('domain') ?? '').trim().toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
            if (!/^(?=.{1,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i.test(domain)) return send(response, 400, { error: 'A valid domain is required.' })
            const upstream = new URL('https://api.ip2whois.com/v2')
            upstream.searchParams.set('key', key)
            upstream.searchParams.set('domain', domain)
            const result = await fetch(upstream)
            const data: any = await result.json()
            if (!result.ok || data.error) return send(response, 502, { error: data.error?.error_message ?? 'WHOIS lookup failed.' })
            return send(response, 200, { domain: data.domain, status: data.status, created: data.create_date, updated: data.update_date, expires: data.expire_date, age: data.domain_age, registrar: data.registrar?.name ?? '', registrarUrl: data.registrar?.url ?? '', nameservers: Array.isArray(data.nameservers) ? data.nameservers : [] })
          }

          if (url.pathname === '/api/hosted-domains') {
            const ip = url.searchParams.get('ip')?.trim() ?? ''
            if (!isIP(ip)) return send(response, 400, { error: 'A valid IPv4 or IPv6 address is required.' })
            const upstream = new URL('https://domains.ip2whois.com/domains')
            upstream.searchParams.set('key', key)
            upstream.searchParams.set('ip', ip)
            const result = await fetch(upstream)
            const data: any = await result.json()
            if (!result.ok || data.error) return send(response, 502, { error: data.error?.error_message ?? 'Hosted domain lookup failed.' })
            return send(response, 200, { ip: data.ip, total: data.total_domains, page: data.page, pages: data.total_pages, domains: Array.isArray(data.domains) ? data.domains : [] })
          }

          return next()
        } catch {
          return send(response, 502, { error: 'IP2Location service is unavailable.' })
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['kira.jpeg'],
        manifest: {
          name: 'Kira Tech 2FA',
          short_name: 'Kira 2FA',
          description: 'Tạo mã 2FA ngay trên thiết bị của bạn.',
          theme_color: '#27834e',
          background_color: '#f7faf7',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/kira.jpeg', sizes: '512x512', type: 'image/jpeg', purpose: 'any' },
            { src: '/kira.jpeg', sizes: '512x512', type: 'image/jpeg', purpose: 'maskable' },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          runtimeCaching: [],
        },
      }),
      localApi(env.IP2LOCATION_API_KEY),
    ],
    resolve: { alias: { '@': path.resolve(__dirname, './@') } },
  }
})
