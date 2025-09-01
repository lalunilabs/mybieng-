import { NextRequest, NextResponse } from 'next/server';
import { setAdminCookieHeaders } from '@/lib/adminAuth';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const password: string | undefined = body?.password;
  const expected = process.env.ADMIN_PASSWORD ?? 'admin';
  if (!password || password !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  const headers = setAdminCookieHeaders();
  headers.forEach((value, key) => res.headers.append(key, value));
  return res;
}
