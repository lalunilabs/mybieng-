import { NextRequest, NextResponse } from 'next/server';
import { clearAdminCookieHeaders } from '@/lib/adminAuth';

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true });
  const headers = clearAdminCookieHeaders();
  headers.forEach((value, key) => res.headers.append(key, value));
  return res;
}

export const dynamic = 'force-dynamic';
