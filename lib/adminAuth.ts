import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_auth';

export function requireAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (token !== '1') {
    redirect('/admin/login');
  }
}

export function isAdminRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  return cookie === '1';
}

export function clearAdminCookieHeaders() {
  const headers = new Headers();
  headers.append('Set-Cookie', `${ADMIN_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax`);
  return headers;
}

export function setAdminCookieHeaders() {
  const headers = new Headers();
  // Note: secure flag omitted for local dev; Next/Vercel should set Secure in prod.
  headers.append('Set-Cookie', `${ADMIN_COOKIE}=1; Path=/; HttpOnly; SameSite=Lax`);
  return headers;
}
