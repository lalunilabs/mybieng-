import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://mybeing.com';
  
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /
Allow: /about
Allow: /research
Allow: /blog
Allow: /quizzes
Allow: /blog/*
Allow: /quizzes/*`;

  return new NextResponse(robots, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
