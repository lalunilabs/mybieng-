import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'admin_auth'; // legacy fallback

export function requireAdmin() {
  // Owner-only gate: presence of signed admin_token (set by /api/admin/auth/login)
  const cookieStore = cookies();
  const token = cookieStore.get('admin_token')?.value;
  if (!token) {
    redirect('/admin/login');
  }
}

export function isAdminRequest(req: NextRequest): boolean {
  // Accept modern token or legacy boolean cookie
  const token = req.cookies.get('admin_token')?.value;
  if (token) return true;
  const legacy = req.cookies.get(ADMIN_COOKIE)?.value;
  return legacy === '1';
}

export function clearAdminCookieHeaders() {
  const headers = new Headers();
  headers.append('Set-Cookie', `${ADMIN_COOKIE}=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure`);
  return headers;
}

export function setAdminCookieHeaders() {
  const headers = new Headers();
  headers.append('Set-Cookie', `${ADMIN_COOKIE}=1; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=86400`);
  return headers;
}
