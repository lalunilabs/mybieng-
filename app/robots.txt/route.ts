import { NextResponse } from 'next/server'

export async function GET() {
  const baseUrl = 'https://mybeing.in'
  
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /_next/
Disallow: /static/
Disallow: *.json
Disallow: /dashboard/private/

User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard/private/

User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /dashboard/private/

Sitemap: ${baseUrl}/sitemap.xml
Host: ${baseUrl}`

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400'
    }
  })
}
