import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { timingSafeEqual } from 'crypto';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  permissions: readonly string[];
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface AdminSession {
  user: AdminUser;
  token: string;
  expiresAt: string;
}

// Role-based permissions
export const ADMIN_PERMISSIONS = {
  super_admin: [
    'users.read',
    'users.write',
    'users.delete',
    'content.read',
    'content.write',
    'content.delete',
    'subscriptions.read',
    'subscriptions.write',
    'ai_chat.read',
    'ai_chat.moderate',
    'system.read',
    'system.write',
    'analytics.read',
    'reports.read',
    'reports.export',
    'settings.read',
    'settings.write',
    'security.read',
    'security.write',
    'admin.manage'
  ],
  admin: [
    'users.read',
    'users.write',
    'content.read',
    'content.write',
    'subscriptions.read',
    'ai_chat.read',
    'ai_chat.moderate',
    'system.read',
    'analytics.read',
    'reports.read',
    'reports.export',
    'settings.read'
  ],
  moderator: [
    'users.read',
    'content.read',
    'content.write',
    'ai_chat.read',
    'ai_chat.moderate',
    'analytics.read'
  ]
} as const;

// Owner-only admin: single super_admin defined by environment
const OWNER_EMAIL = process.env.OWNER_EMAIL || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '';

const SESSION_DURATION_SEC = Number(process.env.ADMIN_SESSION_TIMEOUT || '86400');
const SESSION_DURATION = Number.isFinite(SESSION_DURATION_SEC) && SESSION_DURATION_SEC > 0
  ? SESSION_DURATION_SEC * 1000
  : 24 * 60 * 60 * 1000; // fallback to 24h

export class AdminAuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

function getJWTSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 16) {
    // Only thrown at the time of admin auth usage
    throw new AdminAuthError('Admin not configured', 'ADMIN_NOT_CONFIGURED');
  }
  return secret;
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminSession> {
  // Enforce owner-only login with env-based password
  if (!OWNER_EMAIL || !ADMIN_PASSWORD) {
    throw new AdminAuthError('Admin not configured', 'ADMIN_NOT_CONFIGURED');
  }

  const emailBuf = Buffer.from(email);
  const ownerBuf = Buffer.from(OWNER_EMAIL);
  const pwdBuf = Buffer.from(password);
  const envPwdBuf = Buffer.from(ADMIN_PASSWORD);

  const emailMatch = emailBuf.length === ownerBuf.length && timingSafeEqual(emailBuf, ownerBuf);
  const pwdMatch = pwdBuf.length === envPwdBuf.length && timingSafeEqual(pwdBuf, envPwdBuf);

  if (!emailMatch || !pwdMatch) {
    throw new AdminAuthError('Invalid credentials', 'INVALID_CREDENTIALS');
  }

  const user: AdminUser = {
    id: 'admin_owner',
    email: OWNER_EMAIL,
    name: OWNER_EMAIL.split('@')[0],
    role: 'super_admin',
    permissions: ADMIN_PERMISSIONS.super_admin,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  };

  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    getJWTSecret(),
    { expiresIn: `${Math.floor(SESSION_DURATION / 1000)}s` }
  );

  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();

  return { user, token, expiresAt };
}

export async function verifyAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret) return null;
    const decoded = jwt.verify(token, secret) as any;
    if (!decoded?.email || decoded.email !== OWNER_EMAIL) return null;
    // Reconstruct minimal user (single owner)
    const user: AdminUser = {
      id: 'admin_owner',
      email: OWNER_EMAIL,
      name: OWNER_EMAIL.split('@')[0],
      role: 'super_admin',
      permissions: ADMIN_PERMISSIONS.super_admin,
      createdAt: '2023-01-01T00:00:00Z',
      lastLogin: new Date().toISOString(),
    };
    return user;
  } catch (error) {
    return null;
  }
}

export async function getCurrentAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('admin_token')?.value;
    
    if (!token) {
      return null;
    }

    return await verifyAdminToken(token);
  } catch (error) {
    return null;
  }
}

export function hasPermission(user: AdminUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

export function requirePermission(user: AdminUser, permission: string): void {
  if (!hasPermission(user, permission)) {
    throw new AdminAuthError(
      `Insufficient permissions. Required: ${permission}`,
      'INSUFFICIENT_PERMISSIONS'
    );
  }
}

export async function requireAdminAuth(request?: NextRequest): Promise<AdminUser> {
  const user = await getCurrentAdminUser();
  
  if (!user) {
    throw new AdminAuthError('Authentication required', 'AUTH_REQUIRED');
  }

  return user;
}

export async function requireAdminPermission(
  permission: string,
  request?: NextRequest
): Promise<AdminUser> {
  const user = await requireAdminAuth(request);
  requirePermission(user, permission);
  return user;
}

export function createAdminSession(user: AdminUser): AdminSession {
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    getJWTSecret(),
    { expiresIn: `${Math.floor(SESSION_DURATION / 1000)}s` }
  );

  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();

  return {
    user,
    token,
    expiresAt
  };
}

export function clearAdminSession(): void {
  // This would typically clear the session cookie
  // Implementation depends on your cookie handling approach
}

export function isValidAdminRole(role: string): role is AdminUser['role'] {
  return ['super_admin', 'admin', 'moderator'].includes(role);
}

export function getPermissionsForRole(role: AdminUser['role']): readonly string[] {
  return ADMIN_PERMISSIONS[role];
}
