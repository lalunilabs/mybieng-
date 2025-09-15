import { ImageResponse } from 'next/og';
import React from 'react';

export const runtime = 'edge';

function parseParam(url: URL, key: string, fallback = '') {
  const v = url.searchParams.get(key);
  if (!v) return fallback;
  return v.slice(0, 200);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const title = parseParam(url, 'title', 'MyBeing');
    const subtitle = parseParam(url, 'subtitle', 'Research-backed self-discovery');

    const badge = React.createElement(
      'div',
      {
        style: {
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: 20,
          fontWeight: 700,
          color: '#4f46e5',
          background: 'rgba(79,70,229,0.08)',
          border: '1px solid rgba(79,70,229,0.2)',
          borderRadius: 999,
          padding: '8px 16px',
          marginBottom: 24,
        },
      },
      [
        React.createElement('span', { key: 'icon', style: { marginRight: 8 } }, '🧠'),
        'MyBeing',
      ]
    );

    const titleEl = React.createElement(
      'div',
      {
        style: {
          fontSize: 64,
          fontWeight: 800,
          lineHeight: 1.1,
          marginBottom: 16,
          maxWidth: 960,
        },
      },
      title
    );

    const subtitleEl = React.createElement(
      'div',
      { style: { fontSize: 28, color: '#374151', maxWidth: 960 } },
      subtitle
    );

    const corner = React.createElement(
      'div',
      { style: { position: 'absolute', right: 64, bottom: 48, fontSize: 20, color: '#6b7280' } },
      'mybeing.com'
    );

    const root = React.createElement(
      'div',
      {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 50%, #f0f9ff 100%)',
          padding: '64px',
          color: '#111827',
          fontFamily: 'Inter, ui-sans-serif, system-ui',
          position: 'relative',
        },
      },
      [badge, titleEl, subtitleEl, corner]
    );

    return new ImageResponse(root as any, { width: 1200, height: 630 });
  } catch (e) {
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
