import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';

const ADMIN_COOKIE = 'admin_auth';
const OWNER_EMAIL = process.env.OWNER_EMAIL;

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated and is the owner
  if (!session?.user?.email || session.user.email !== OWNER_EMAIL) {
    redirect('/admin/login');
  }
}

export async function isOwner(email?: string | null): Promise<boolean> {
  if (!email || !OWNER_EMAIL) return false;
  return email === OWNER_EMAIL;
}

export function isAdminRequest(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value;
  return cookie === '1';
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

// Middleware helper for admin routes
export async function checkAdminAccess(): Promise<boolean> {
  try {
    const session = await getServerSession(authOptions);
    return await isOwner(session?.user?.email);
  } catch {
    return false;
  }
}
